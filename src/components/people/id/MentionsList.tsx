import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

// Define the shape of your props
interface MentionsListProps {
    items: string[]
    command: (item: { id: string }) => void
}

// Define the shape of your ref
export interface MentionsListRef {
    onKeyDown: (params: { event: React.KeyboardEvent<HTMLDivElement> }) => boolean
}

// Use forwardRef with generic typing
const MentionsList = forwardRef<MentionsListRef, MentionsListProps>((props, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0)

    const selectItem = (index: number) => {
        const item = props.items[index]
        if (item) props.command({ id: item })
    }

    useEffect(() => setSelectedIndex(0), [props.items])

    useImperativeHandle(ref, () => ({
        onKeyDown: ({ event }: { event: React.KeyboardEvent<HTMLDivElement> }) => {
            if (event.key === 'ArrowUp') {
                setSelectedIndex(i => (i + props.items.length - 1) % props.items.length)
                return true
            }
            if (event.key === 'ArrowDown') {
                setSelectedIndex(i => (i + 1) % props.items.length)
                return true
            }
            if (event.key === 'Enter') {
                selectItem(selectedIndex)
                return true
            }
            return false
        },
    }))

    return (
        <div className="dropdown-menu">
            {props.items.length ? (
                props.items.map((item, index) => (
                    <button
                        key={index}
                        className={index === selectedIndex ? 'is-selected' : ''}
                        onMouseDown={e => e.preventDefault()} // Prevent editor blur
                        onClick={() => selectItem(index)}
                    >
                        {item}
                    </button>
                ))
            ) : (
                <div className="item p-1">No results</div>
            )}
        </div>
    )
})

export default MentionsList
