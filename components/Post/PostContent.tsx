import React, { memo } from 'react'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import remarkHeadingId from 'remark-heading-id'
import styles from './post-content.module.scss'

export interface PostContentProps {
  content: string
}

const replaceHighlight = (content: string) => {
  const matched = content.matchAll(/\s?==.+==\s?/g);
  if(!matched) return content;

  const matchedArr = [...matched];
  let res = content;
  matchedArr.forEach(matched => {
    const matchedStr = matched[0]
    const markedStr = matchedStr.replace(' ==', '<mark>').replace('== ', '</mark>')
    res = res.replace(matchedStr, markedStr)
  })

  return res;
}

const PostContent = ({
  content,
}: PostContentProps) => {
  return (
    <div>
      <ReactMarkdown 
        rehypePlugins={[rehypeRaw]} 
        remarkPlugins={[remarkGfm, remarkHeadingId]} 
        className={styles['markdown-content']}
      >
        {replaceHighlight(content)}
      </ReactMarkdown>
    </div>
  )
}

export default memo(PostContent)