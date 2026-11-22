// Every overlay that currently blocks the page scroll. The page stays pinned while at least one owner holds it.
export const scrollLockOwners = new Set<symbol>()
