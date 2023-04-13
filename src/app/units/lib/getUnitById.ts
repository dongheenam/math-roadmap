import units from './units';

const getUnitById = async (_id: string) => {
  const unit = units.find((unit) => unit._id === _id);
  return unit;
};
export default getUnitById;
