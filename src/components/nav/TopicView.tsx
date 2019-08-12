/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { sanitize } from 'dompurify'
import React, { useEffect, useState } from 'react'
import { FormattedRelative } from 'react-intl'
import {
  Heading,
  IndividualTopic,
  Link,
  oldestFirst,
  Post,
  Timestamp,
  Title,
  Topic,
  TopicItem,
} from './Updates'

const ALLOWED_TAGS = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'p',
  'div',
  'span',
  'img',
  'ul',
  'ol',
  'li',
]

const sanitizedContent = (html: string, max?: number) => {
  const content = max && html.length > max ? html.substring(0, max) + '…' : html

  const output = sanitize(content, { ALLOWED_TAGS })

  return <div dangerouslySetInnerHTML={{ __html: output }} />
}

export const TopicView: React.FC<{ host: string; topic: Topic }> = ({
  host,
  topic,
}) => {
  const [post, setPost] = useState<Post>()
  const [error, setError] = useState<Error>()

  useEffect(() => {
    if (topic) {
      fetch(`${host}/t/${topic.id}.json`)
        .then(response => response.json())
        .then(data => {
          const post = data.post_stream.posts.sort(oldestFirst)[0]
          setPost(post)
        })
        .catch(error => {
          setError(error.message)
        })
    } else {
      setPost(undefined)
    }
  }, [topic])

  if (!topic) {
    return null
  }

  return (
    <IndividualTopic>
      <Heading>
        <Title>
          <Link
            href={`${host}/t/${topic.id}`}
            title={`Read more about "${topic.title}" at ${host}`}
            target={'_blank'}
          >
            {topic.title}
          </Link>
        </Title>

        <div>
          <Timestamp>
            <FormattedRelative value={topic.created_at} />
          </Timestamp>
        </div>
      </Heading>

      {
        <TopicItem>
          {error ? (
            <div>There was an error loading this post.</div>
          ) : post ? (
            sanitizedContent(post.cooked)
          ) : (
            'Loading…'
          )}
        </TopicItem>
      }
    </IndividualTopic>
  )
}