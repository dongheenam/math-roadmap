import { SUBJECTS, Syllabus, TOPICS } from '../types/skills';

// Temporary space to store all units that are available
type Unit = Omit<Syllabus, 'code'> & {
  codes: string[];
};

const units: Unit[] = [];
export default units;
