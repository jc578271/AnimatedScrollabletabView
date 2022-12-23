import {forwardRef, memo, ReactElement, RefObject} from 'react';

interface ForwardRefRenderFunction<T, P = {}> {
  (props: P, ref: RefObject<T>): ReactElement | null;
  displayName?: string | undefined;
  defaultProps?: never | undefined;
  propTypes?: never | undefined;
}

export const typeMemo: <T>(c: T) => T = memo;
export const memoForwardRef = <T, P = {}>(c: ForwardRefRenderFunction<T, P>) =>
// @ts-ignore
  memo(forwardRef(c));
