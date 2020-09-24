export const getStatusTagColor = (tag: string) => {
  return tag === 'failed'
    ? 'volcano'
    : tag === 'pending'
    ? 'gold'
    : tag === 'completed'
    ? 'green'
    : 'geekblue';
};

export const getTypeTagColor = (tag: string) => {
  return tag === 'wgs' ? 'magenta' : tag === 'wes' ? 'purple' : 'cyan';
};

export const getPriorityTagColor = (tag: string) => {
  return tag === 'high' ? 'gold' : tag === 'normal' ? 'cyan' : 'blue';
};
