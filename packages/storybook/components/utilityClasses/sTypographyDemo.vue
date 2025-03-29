<template>
  <SCard>
    <SCardTitle>Typography</SCardTitle>
    <SList>
      <SListItem v-for="typo in typographies" :key="typo.name">
        <SListItemContent>
          <SListItemTitle>class: s_text--{{ typo.name }}</SListItemTitle>
          <div :class="typo.classAttr">{{ sampleText }}</div>
        </SListItemContent>
      </SListItem>
    </SList>
    <SCardTitle>Asterisk List</SCardTitle>
    <SCardText>
      <div>s_list--asterisk</div>
      <ul class="s_list--asterisk">
        <li v-for="(word, i) in words" :key="i">{{ word }}</li>
      </ul>
      <div class="s_text--h5 k_my__4">Font emphasis</div>
      <div class="exampleColumn s_mb__2">
        <div>s_fontWeight__bold:</div>
        <div class="s_fontWeight__bold">{{ sampleText }}</div>
      </div>
      <div>other modifiers: WIP</div>
      <div>can be implemented in <span class="italicText">src/styles/variables/_utilities.scss</span></div>
      <div class="s_text--h5 k_my__4">Text decoration</div>
      <div class="textDecoration">
        <div v-for="(decoration, index) in textDecorations" :key="index" class="exampleColumn">
          <div class="s_fontWeight__bold">{{ decoration }}</div>
          <div :class="decoration">{{ sampleText }}</div>
        </div>
      </div>
      <div class="s_text--h5 k_my__4">Text alignment</div>
      <div class="textAlignment">
        <div v-for="(align, index) in textAlignments" :key="index" class="exampleRow">
          <div class="s_fontWeight__bold">{{ align }}</div>
          <div :class="align">{{ sampleLongText }}</div>
        </div>
      </div>
      <div class="s_text--h5 k_my__4">White space [css <a :href="whiteSpaceDocLink">reference</a>]</div>
      <div class="whiteSpacing">
        <div v-for="(whiteSpace, index) in whiteSpacing" :key="index" class="exampleRow">
          <div class="s_fontWeight__bold">{{ whiteSpace }}</div>
          <div :class="whiteSpace" style="max-width: 4rem; background-color: #00ffff">This is a sample text.</div>
        </div>
      </div>
      <div class="s_text--h5 k_my__4">Overflow-wrap & word-break</div>
      <div>
        <span class="italicText">s_text__breakword</span> represents both properties.
        <span class="s_textDecoration__underline"> Applied by default. </span>
      </div>
      <div class="overflowExample s_mt__2">
        <div>
          <div class="s_fontWeight__bold">Without breaking</div>
          <div class="wordBreakSample s_textAlign__center">
            Most words are short & don't need to break. But <b>Antidisestablishmentarianism</b> is long. The width is
            set to min-content, with a max-width of 11em.
          </div>
        </div>
        <div>
          <div class="s_fontWeight__bold">k_text__breakword</div>
          <div class="wordBreakSample s_textAlign__center k_text__breakword">
            Most words are short & don't need to break. But <b>Antidisestablishmentarianism</b> is long. The width is
            set to min-content, with a max-width of 11em.
          </div>
        </div>
      </div>
      <div class="s_text--h5 k_my__4">Text shadowing</div>
      <div class="shadowingExample">
        <div v-for="(textShadow, index) in textShadowing" :key="index" class="exampleColumn">
          <div class="s_fontWeight__bold">{{ textShadow }}</div>
          <div :class="textShadow">{{ sampleText }}</div>
        </div>
      </div>
      <div class="s_text--h5 k_my__4">Text transform</div>
      <div class="tranformExample">
        <input v-model="sampleInput" class="tranformExample__input s_mb__2" />
        <div class="exampleItems">
          <div v-for="(transform, index) in textTransform" :key="index">
            <div class="s_fontWeight__bold">{{ transform }}</div>
            <div :class="transform">{{ sampleInput }}</div>
          </div>
        </div>
      </div>
    </SCardText>
  </SCard>
</template>

<script setup lang="ts">
import { faker } from '@khsura/shared'
import { SCard, SCardTitle, SCardText, SList, SListItem, SListItemContent, SListItemTitle } from '@khsura/sui/index'
import { ref } from 'vue'
import type { PropType } from 'vue'

defineProps({
  typographies: {
    type: Array as PropType<Array<{ classAttr: string; name: string }>>,
    default: () => [{ classAttr: 's_text--h1', name: 'h1' }],
  },
  textDecorations: {
    type: Array as PropType<string[]>,
    default: () => ['s_textDecoration--lineThrough'],
  },
  textAlignments: {
    type: Array as PropType<string[]>,
    default: () => ['left'],
  },
  whiteSpacing: {
    type: Array as PropType<string[]>,
    default: () => ['s_text__wrap'],
  },
  textShadowing: {
    type: Array as PropType<string[]>,
    default: () => ['s_textShadow__0'],
  },
  textTransform: {
    type: Array as PropType<string[]>,
    default: () => ['s_text__capitalize'],
  },
})

const sampleText = 'Sample Text'
const sampleLongText = faker.lorem.words({ max: 30, min: 25 })
const whiteSpaceDocLink = 'https://developer.mozilla.org/en-US/docs/Web/CSS/white-space'
const sampleInput = ref('CHAnge mE')

const words = Array(5)
  .fill('')
  .map(() => faker.word.noun())
</script>

<style lang="scss">
.italicText {
  font-style: italic;
}

.textDecoration {
  display: flex;
  justify-content: space-between;

  .exampleColumn {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
  }
}

.textAlignment {
  display: flex;
  flex-direction: column;
  gap: 10px;

  .exampleRow {
    display: flex;
    flex-direction: column;
    gap: 2px;
    align-items: center;
  }
}

.whiteSpacing {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;

  .exampleRow {
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: center;
  }
}

.overflowExample {
  display: flex;
  flex-direction: row;
  justify-content: space-around;

  .wordBreakSample {
    width: 176px;
    max-width: 11em;
    margin-top: 4px;
    font-size: 16px;
    overflow-wrap: normal;
    background-color: #0071eb10;
    border: 2px solid #0071eb;
  }
}

.shadowingExample {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;

  .exampleColumn {
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: center;
  }
}

.tranformExample {
  display: flex;
  flex-direction: column;
  justify-content: center;

  &__input {
    min-width: 20em;
    margin-right: auto;
    margin-left: auto;
    text-align: center;
  }

  .exampleItems {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>
