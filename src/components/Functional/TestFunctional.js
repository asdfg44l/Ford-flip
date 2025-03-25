// import { h } from "vue";

// const TextContent = (props, context) => {
//     console.log(context.slots.default())
//     return h(
//         props.type,
//         {
//             class: "text-green",
//         },
//         [
//             props.content,
//             context.slots.default()
//         ]
//     )
// }

// export default TextContent

import { h } from 'vue'
import Greeting from '@/components/Greeting.vue'

export default {
  props: {
    type: {
      type: String,
    },
    content: {
      type: String,
    },
    textList: {
      type: Array,
    },
  },
  setup(props, context) {
    console.log(context.slots.default())
    const greetingList = h('ul', [
      props.textList.map((item) => h('li', { key: item }, [item])),
    ])
    return () =>
      h(
        props.type,
        {
          class: 'text-green',
        },
        [
          h(
            Greeting,
            {
              class: ['text-red-600'],
            },
            {
              default: () => h('p', ['default slot']),
              title: ({ content }) => h('p', [`title slot ${content}`]),
            }
          ),
          props.content,
          context.slots.default(),
          props.textList?.length > 0 && greetingList,
          context.slots.title({ name: 'mochi' }),
        ]
      )
  },
}
