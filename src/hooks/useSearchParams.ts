import { NavigateOptions } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import queryString, { ParsedQuery } from 'query-string';
import { useCallback, useMemo } from 'react';
import { AnyObject } from 'yup';

export type SearchParams = ParsedQuery<string>;

const useQuerySearchParams = <T extends AnyObject>() => {
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  const queryParams: Partial<T> = useMemo(() => {
    const params: Partial<T> = {};
    searchParams.forEach((value, key) => {
      const keyWithType = key as keyof T;
      const valueWithType = value as T[keyof T];

      if (params[keyWithType]) {
        if (Array.isArray(params[keyWithType])) {
          params[keyWithType].push(valueWithType);
        } else {
          params[keyWithType] = [
            params[keyWithType],
            valueWithType,
          ] as T[keyof T];
        }
      } else {
        params[keyWithType] = valueWithType;
      }
    });
    return params;
  }, [searchParams]);

  const onChangeSearchParams = useCallback(
    (params: Partial<T>, options?: NavigateOptions) => {
      replace(
        `${pathname}?${decodeURIComponent(stringifyParams(params))}`,
        options
      );
    },
    [pathname, replace]
  );

  return { queryParams, onChangeSearchParams, replace };
};

const stringifyParams = queryString.stringify;

export { stringifyParams, useQuerySearchParams };
