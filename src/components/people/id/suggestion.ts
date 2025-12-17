import { computePosition, flip, shift } from '@floating-ui/dom'
import { posToDOMRect, ReactRenderer, Editor } from '@tiptap/react'
import MentionsList, { MentionsListRef } from './MentionsList'

// Props passed from Tiptap suggestion
interface SuggestionProps {
    editor: Editor
    range: { from: number; to: number }
    query: string
    clientRect?: (() => DOMRect | null) | null
    command: (item: { id: string }) => void
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

export default {
    // Filtered items based on the query
    items: ({ query }: { query: string }) => {
        const people = [
            'Lea Thompson', 'Cyndi Lauper', 'Tom Cruise', 'Madonna',
            'Jerry Hall', 'Joan Collins', 'Winona Ryder', 'Christina Applegate',
            'Alyssa Milano', 'Molly Ringwald', 'Ally Sheedy', 'Debbie Harry',
            'Olivia Newton-John', 'Elton John', 'Michael J. Fox', 'Axl Rose',
            'Emilio Estevez', 'Ralph Macchio', 'Rob Lowe', 'Jennifer Grey',
            'Mickey Rourke', 'John Cusack', 'Matthew Broderick', 'Justine Bateman',
            'Lisa Bonet',
        ]

        return people
            .filter(item => item.toLowerCase().startsWith(query.toLowerCase()))
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
}
