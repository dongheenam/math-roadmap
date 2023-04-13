import { SUBJECTS, Syllabus, TOPICS } from '../../types/skills';

// Temporary space to store all units that are available
type Unit = Omit<Syllabus, 'code'> & {
  _id: string;
  name: string;
  topic: string;
  codes: string[];
};

const units: Unit[] = [
  {
    _id: 'ib-ai-sl-trig',
    name: 'Trigonometry',
    course: 'IB',
    subject: 'AI SL',
    topic: 'Geometry',
    codes: ['SL 3.2', 'SL 3.3', 'SL 3.4'],
  },
];
export default units;
