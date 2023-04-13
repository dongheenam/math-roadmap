'use client';

import { useReducer } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { COURSES, SUBJECTS, TOPICS } from '../types/skills';
import type { Query } from '../api/lib/searchSkills';

type Props = {
  parsedParams: Partial<Query>;
};

type State = {
  course: typeof COURSES[number];
  subject: typeof SUBJECTS[State['course']][number];
  topic: typeof TOPICS[number];
  code: string;
  text: string;
};

const INITIAL_STATE: State = {
  course: 'AC',
  subject: '7',
  code: '',
  topic: 'Number',
  text: '',
};
const updater = (prev: State, next: Partial<State>) => {
  const updates = { ...next };

  if (updates.course) {
    updates.subject = SUBJECTS[updates.course][0];
  }

  return { ...prev, ...updates };
};

const verifyParams = (parsedParams: Partial<Query>): Partial<State> => {
  const { course, subject, topic, code, text } = parsedParams;
  const verifiedParams: Partial<State> = {};
  if (text) {
    verifiedParams.text = text;
  }
  if (code) {
    verifiedParams.code = code;
  }

  if (topic && TOPICS.includes(topic)) {
    verifiedParams.topic = topic;
  }

  if (course && COURSES.includes(course)) {
    verifiedParams.course = course;

    const possibleSubjects = SUBJECTS[course];
    if (subject && possibleSubjects.includes(subject)) {
      verifiedParams.subject = subject;
    }
  }

  return verifiedParams;
};

export default function SearchForm({ parsedParams }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const [state, updateState] = useReducer(updater, {
    ...INITIAL_STATE,
    ...verifyParams(parsedParams),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const searchParams = new URLSearchParams(state);
    router.push(`${pathname}?${searchParams.toString()}`);
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="topic">Topic:</label>
        <select
          id="topic"
          value={state.topic}
          onChange={(e) =>
            updateState({
              topic: e.target.value as State['topic'],
            })
          }
        >
          {TOPICS.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
        <label htmlFor="course">Course:</label>
        <select
          id="course"
          value={state.course}
          onChange={(e) =>
            updateState({
              course: e.target.value as State['course'],
            })
          }
        >
          <option value="AC">AC</option>
          <option value="IB">IB</option>
        </select>
        <label htmlFor="subject">Subject:</label>
        <select
          id="subject"
          value={state.subject}
          onChange={(e) =>
            updateState({ subject: e.target.value as State['subject'] })
          }
        >
          {SUBJECTS[state.course] &&
            SUBJECTS[state.course].map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
        </select>
        <label htmlFor="search-text">Search text:</label>
        <input
          id="search-text"
          type="text"
          value={state.text}
          onChange={(e) => updateState({ text: e.target.value })}
        />
        <button type="submit">Search</button>
      </form>
      <code>current state: {JSON.stringify(state)}</code>
    </>
  );
}
