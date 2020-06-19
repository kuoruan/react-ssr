export function initRecoilState(data: any) {
  return function ({ set, setUnvalidatedAtomValues }: any) {
    for (const key in data) {
      set(key, JSON.parse(data[key]));
    }
  };
}
