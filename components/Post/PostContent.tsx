import React, { memo } from 'react'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import styles from './post-content.module.scss'

export interface PostContentProps {
  content: string
}

const PostContent = ({
  content,
}: PostContentProps) => {
  return (
    <div>
      <ReactMarkdown remarkPlugins={[remarkGfm]} className={styles['markdown-content']}>
        {content}
      </ReactMarkdown>
    </div>
  )
}

export default memo(PostContent)