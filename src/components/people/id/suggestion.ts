import { computePosition, flip, shift } from '@floating-ui/dom'
import { posToDOMRect, ReactRenderer, Editor } from '@tiptap/react'
import MentionsList, { MentionsListRef } from './MentionsList'
import { GetOrganizationMembers } from '@/lib/data/backend/clientCalls'

// Props passed from Tiptap suggestion
interface SuggestionProps {
    editor: Editor
    range: { from: number; to: number }
    query: string
    clientRect?: (() => DOMRect | null) | null
    command: (item: { id: string, label: string }) => void
}

// Helper to position the dropdown
const updatePosition = (editor: Editor, element: HTMLElement) => {
    const virtualElement = {
        getBoundingClientRect: () =>
            posToDOMRect(editor.view, editor.state.selection.from, editor.state.selection.to),
    }
    computePosition(virtualElement, element, {
        placement: 'bottom-start',
        strategy: 'absolute',
        middleware: [shift(), flip()],
    }).then(({ x, y, strategy }) => {
        element.style.width = 'max-content'
        element.style.position = strategy
        element.style.left = `${x}px`
        element.style.top = `${y}px`
    })
}

// Export a function that creates the suggestion config with orgID
export const createSuggestion = (orgID: string[]) => ({
    items: async ({ query }: { query: string; editor: Editor }) => {
        const people = await GetOrganizationMembers(orgID)
        console.log('Fetched people for mentions:', people)
        return people
            .filter(item => item.Name.toLowerCase().startsWith(query.toLowerCase()))
            .slice(0, 5)
    },
    render: () => {
        let component: ReactRenderer<MentionsListRef> | null = null
        return {
            onStart: (props: SuggestionProps) => {
                component = new ReactRenderer(MentionsList, {
                    props,
                    editor: props.editor,
                })
                const rect = typeof props.clientRect === 'function' ? props.clientRect() : props.clientRect
                if (!rect || !component) return
                component.element.style.position = 'absolute'
                document.body.appendChild(component.element)
                updatePosition(props.editor, component.element)
            },
            onUpdate: (props: SuggestionProps) => {
                if (!component) return
                component.updateProps(props)
                const rect = typeof props.clientRect === 'function' ? props.clientRect() : props.clientRect
                if (!rect) return
                updatePosition(props.editor, component.element)
            },
            onKeyDown: (props: { event: any }) => {
                if (!component) return false
                const event = props.event
                if (event.key === 'Escape') {
                    component.destroy()
                    component = null
                    return true
                }
                // Delegate to MentionsList ref
                return component.ref?.onKeyDown({ event }) ?? false
            },
            onExit: () => {
                if (!component) return
                component.element.remove()
                component.destroy()
                component = null
            },
        }
    },
})
