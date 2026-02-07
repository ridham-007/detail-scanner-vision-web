"use client";

import NextLink from 'next/link';
import type { LinkProps as NextLinkProps } from 'next/link';
import { useRouter, usePathname, useParams as useNextParams, useSearchParams as useNextSearchParams } from 'next/navigation';
import { useEffect, type ReactNode, type AnchorHTMLAttributes } from 'react';

type LinkProps = Omit<NextLinkProps, 'href'> & 
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof NextLinkProps> & {
    to: string;
    children?: ReactNode;
  };

export function Link({ to, ...props }: LinkProps) {
  return <NextLink href={to} {...props} />;
}

type NavigateOptions = {
  replace?: boolean;
};

export function useNavigate() {
  const router = useRouter();
  return (path: string | number, options?: NavigateOptions) => {
    if (typeof path === 'number') {
      if (path === -1) router.back();
      return;
    }
    if (options?.replace) {
      router.replace(path);
    } else {
      router.push(path);
    }
  };
}

type Location = {
  pathname: string;
  search: string;
  hash: string;
  state: null;
  key: string;
};

export function useLocation(): Location {
  const pathname = usePathname();
  const searchParams = useNextSearchParams();
  return {
    pathname,
    search: searchParams?.toString() ? `?${searchParams.toString()}` : '',
    hash: '',
    state: null,
    key: 'default'
  };
}

export function useParams<T extends Record<string, string | string[]> = Record<string, string>>() {
  return useNextParams() as T;
}

type SetSearchParams = (newParams: Record<string, string> | URLSearchParams) => void;

export function useSearchParams(): [URLSearchParams, SetSearchParams] {
  const searchParams = useNextSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const setParams: SetSearchParams = (newParams) => {
    const params = new URLSearchParams(newParams);
    router.push(`${pathname}?${params.toString()}`);
  };

  return [new URLSearchParams(searchParams?.toString() ?? ''), setParams];
}

type NavigateProps = {
  to: string;
  replace?: boolean;
};

export function Navigate({ to, replace }: NavigateProps) {
  const router = useRouter();
  useEffect(() => {
    if (replace) router.replace(to);
    else router.push(to);
  }, [to, replace, router]);
  return null;
}

export function Outlet() {
  return null;
}

type NavLinkRenderProps = {
  isActive: boolean;
  isPending: boolean;
};

type NavLinkProps = Omit<LinkProps, 'className'> & {
  className?: string | ((props: NavLinkRenderProps) => string);
};

export function NavLink({ to, className, children, ...props }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === to;

  const combinedClassName = typeof className === 'function'
    ? className({ isActive, isPending: false })
    : className;

  return <Link to={to} className={combinedClassName} {...props}>{children}</Link>;
}