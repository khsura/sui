/** Edit distance (insertions, deletions, substitutions) between two strings. */
export const levenshteinDistance = (source: string, target: string): number => {
  let previousRow = Array.from({ length: target.length + 1 }, (_, index) => index)

  for (let sourceIndex = 1; sourceIndex <= source.length; sourceIndex++) {
    const currentRow = [sourceIndex]

    for (let targetIndex = 1; targetIndex <= target.length; targetIndex++) {
      const substitutionCost = source[sourceIndex - 1] === target[targetIndex - 1] ? 0 : 1

      currentRow.push(
        Math.min(
          previousRow[targetIndex] + 1,
          currentRow[targetIndex - 1] + 1,
          previousRow[targetIndex - 1] + substitutionCost,
        ),
      )
    }

    previousRow = currentRow
  }

  return previousRow[target.length]
}
