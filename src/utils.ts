export const persistKey = (suffix: string) => `DESENSITIZE_${suffix}`;

export const has = (key: string) => !!localStorage.getItem(persistKey(key));

export const writeOnce = (key: string, value = '1') => localStorage.setItem(persistKey(key), value);

export const readOnce = (key: string) => {
    const signal = persistKey(key);
    const value = localStorage.getItem(signal);
    if (value) {
      return value;
    }

    return;
}
