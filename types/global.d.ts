type Omit2<T, K extends keyof T | String> = Pick<T, Exclude<keyof T, K>>
