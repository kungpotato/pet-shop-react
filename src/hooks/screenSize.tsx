import React, { useEffect, useState } from 'react'

export const useScreenSize = ({ maxWidth }: { maxWidth: number }) => {
    const [size, setSize] = useState(false)

    useEffect(() => {
        window.addEventListener("resize", (res) => {
            if (res.isTrusted) {
                if (maxWidth > window.innerWidth) {
                    setSize(true)
                } else {
                    setSize(false)
                }
            }
        })
    }, [window, maxWidth, size])
    return size
}