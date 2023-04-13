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
  topic: typeof TOPICS[State['course']][number];
  code: string;
  searchText: string;
};

const INITIAL_STATE: State = {
  course: 'AC',
  subject: '7',
  code: '',
  topic: 'Number',
  searchText: '',
};
const updater = (prev: State, next: Partial<State>) => {
  const updates = { ...next };

  if (updates.course) {
    updates.subject = SUBJECTS[updates.course][0];
    updates.topic = TOPICS[updates.course][0];
  }

  return { ...prev, ...updates };
};

const verifyParams = (parsedParams: Partial<Query>): Partial<State> => {
  const verifiedParams: Partial<State> = {};
  if (parsedParams.searchText) {
    verifiedParams.searchText = parsedParams.searchText;
  }

  if (parsedParams.course && parsedParams.course in SUBJECTS) {
    const course = parsedParams.course as State['course'];
    verifiedParams.course = course;

    const possibleSubjects = SUBJECTS[course];
    if (parsedParams.subject && parsedParams.subject in possibleSubjects) {
      verifiedParams.subject = parsedParams.subject as State['subject'];
    }
    const possibleTopics = TOPICS[course];
    if (parsedParams.topic && parsedParams.topic in possibleTopics) {
      verifiedParams.topic = parsedParams.topic as State['topic'];
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
          {TOPICS[state.course] &&
            TOPICS[state.course].map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
        </select>
        <label htmlFor="search-text">Search text:</label>
        <input
          id="search-text"
          type="text"
          value={state.searchText}
          onChange={(e) => updateState({ searchText: e.target.value })}
        />
        <button type="submit">Search</button>
      </form>
      <code>current state: {JSON.stringify(state)}</code>
    </>
  );
}
