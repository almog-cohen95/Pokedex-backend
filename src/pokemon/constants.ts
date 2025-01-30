export const POKEMON_NAME_ENGLISH = 'name.english';

export const sortByConst: Record<string, string> = {
  name: 'name.english',
  hp: 'base.HP',
  power: 'base.Attack',
};

export const sortOrderConst: Record<string, 'asc' | 'desc'> = {
  asc: 'asc',
  desc: 'desc',
};

export const defaultSort: Record<string, 'asc' | 'desc'> = {
  id: 'asc',
  'name.english': 'asc',
};
