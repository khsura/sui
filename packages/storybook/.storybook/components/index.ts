import { styled } from '@storybook/theming'

const baseAttributes = {
  // example of custom font
  fontFamily: '"Noto Sans JP", sans-serif',
}

export const themeComponents = {
  div: styled.div(() => ({})),
  p: styled.p(() => baseAttributes),
  h1: styled.h1(() => baseAttributes),
  h2: styled.h2(() => baseAttributes),
  h3: styled.h3(() => baseAttributes),
  h4: styled.h4(() => baseAttributes),
  h5: styled.h5(() => baseAttributes),
  h6: styled.h6(() => baseAttributes),
  span: styled.span(() => baseAttributes),
  input: styled.input(() => baseAttributes),
  // code: styled.code(() => ({ backgroundColor: '#333', color: '#fff' })),
  // pre: styled.pre(() => ({ backgroundColor: '#333' })),
}
