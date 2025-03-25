import { defineConfig } from 'windicss/helpers'

import plugin from 'windicss/plugin'
import colors from 'windicss/colors'
import brandColors from './src/assets/styles/windicss/brandColors'

Object.entries(brandColors).forEach(([key, value]) => {
  if (typeof value === 'string') {
    colors[key] = value
  }
  if (typeof value === 'object') {
    Object.entries(value).forEach(([key2, value2]) => {
      colors[`${key}-${key2}`] = value2
    })
  }
})

const buttonColors = {
  primary: {
    base: colors['primary-1'],
    hover: '#8273EA',
    active: '#5E51B9',
  },
  info: {
    base: colors['primary-2'],
    hover: '#5FA6FF',
    active: '#1872E2',
  },
  danger: {
    base: colors.danger,
    hover: '#FF728B',
    active: '#E13E5B',
  },
}

export default defineConfig({
  important: '.windicss',
  darkMode: 'class',
  extract: {
    include: ['src/**/*.{vue,html,jsx,tsx}'],
    exclude: ['node_modules', '.git'],
  },
  attributify: true,

  theme: {
    extend: {
      screens: {
        table: '765px',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: { ...colors },
    },
  },
  shortcuts: {
    // 'form-control': 'border rounded-lg',
    // font
    'custom-h1': {
      fontSize: '3rem',
      fontWeight: 'bold',
    },
    'custom-h2': {
      fontSize: '2rem',
      fontWeight: '500',
    },
    'custom-h3': {
      fontSize: '1.5rem',
      fontWeight: 'bold',
    },
    'custom-h4': {
      fontSize: '1.125rem',
      fontWeight: '500',
    },
    'custom-h5': {
      fontSize: '.875rem',
    },
    'custom-h6': {
      fontSize: '.75rem',
      fontWeight: 'bold',
    },
    'custom-p': {
      fontSize: '.875rem',
    },
    // gradient
    'bg-gradient': {
      background: 'linear-gradient(95.89deg, #3FFEDC 0.57%, #3F8CFE 99.83%)',
    },
    'text-gradient': {
      display: 'inline-block',
      background: 'linear-gradient(95.89deg, #3FFEDC 0.57%, #3F8CFE 99.83%)',
      backgroundClip: 'text',
      '-webkit-background-clip': 'text', // 尚未找到同時使用 @apply 及依照屬性給設定的方法，加這行 chrome 才有效果
      color: 'transparent',
    },
  },
  plugins: [
    plugin(({ addComponents }) => {
      const modal = {
        '.modal': {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          '&-content': {
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: colors['secondary-1'],
            borderRadius: '16px',
            boxShadow: '0px 4px 24px 0px #00000066',
          },
          '&-md': {
            width: '330px',
            minHeight: '28%',
          },
          '&-lg': {
            maxWidth: '600px',
            minWidth: '480px',
            minHeight: '28%',
          },
        },
        '.vfm': {
          '&--overlay': {
            /**
             * https://stackoverflow.com/questions/7015302/css-hexadecimal-rgba
             */
            // backgroundColor: `${colors['secondary-1']}E5`,
          },
        },
      }

      const input = {
        /** 不知道為什麼，單純的 .el-form-item 是不會被編譯的！ */
        '.windicss .el-form-item': {
          'align-items': 'center',
          /** normal */
          '&__label': {
            'align-items': 'center',
            'justify-content': 'flex-start',
            'white-space': 'nowrap',
          },
          '.el-input': {
            'border-radius': 'var(--el-input-border-radius)',

            '&--large': {
              '--el-input-border-radius': '1rem',
              '.el-icon': {
                height: '1.5rem',
                width: '1.5rem',
                svg: {
                  height: '1.5rem',
                  width: '1.5rem',
                },
              },
            },
          },

          '&:hover': {
            '.el-input': {
              'box-shadow': `0px 0px 12px 0px ${brandColors.primary[1]}`,
            },
          },
          '&:focus-within': {
            '.el-input': {
              'box-shadow': `0px 0px 12px 0px ${brandColors.primary[3]}`,
            },
            '.el-form-item__label': {
              color: brandColors.primary[3],
            },
          },

          /** required */
          '&.is-required': {
            '.el-form-item__label': {
              '&::before': {
                content: 'unset !important',
              },
            },
          },
          /** disabled */
          '&, &:hover, &:focus-within': {
            '.el-input.is-disabled': {
              'box-shadow': 'none',
              '.el-input__wrapper': {
                opacity: '0.6',
              },
            },
          },

          /** error */
          '&.is-error': {
            '&, &:hover, &:focus-within': {
              '.el-form-item__label': {
                color: brandColors.danger,
              },

              '.el-form-item__error': {
                'text-align': 'right',
                right: '0%',
              },

              '.el-input': {
                'box-shadow': 'none',
              },
            },
          },
        },
      }

      const button = {
        '.el-button.btn': {
          /** normal */
          height: '2rem',
          padding: '0.625rem',
          fontSize: '0.875rem',
          border: 'none',
          outline: 'none',
          borderRadius: '0.5rem',
          '&:focus-visible': {
            border: 'none',
            outline: 'none',
          },
          /** disabled */
          '&.is-disabled, &[disabled]': {
            opacity: '0.2',
            cursor: 'not-allowed',
          },

          /** size */
          '&-lg': {
            height: '3.125rem',
            padding: '1rem',
            fontSize: '1.125rem',
          },
          '&-sm': {
            height: '1.5rem',
            padding: '2px 12px',
            borderRadius: '0.25rem',
          },

          /** variant */
          '&': {
            '&, &:focus, &.is-disabled[disabled]': {
              color: colors['secondary-3'],
              backgroundColor: colors['gray-2'],
            },
            '&:hover': {
              color: colors['secondary-3'],
              backgroundColor: colors['gray-1'],
            },
            '&:active': {
              color: colors['secondary-3'],
              backgroundColor: colors['gray-3'],
            },
          },

          '&-primary': {
            '&, &:focus, &.is-disabled[disabled]': {
              color: colors.white,
              backgroundColor: buttonColors.primary.base,
            },
            '&:hover': {
              color: colors.white,
              backgroundColor: buttonColors.primary.hover,
            },
            '&:active': {
              color: colors.white,
              backgroundColor: buttonColors.primary.active,
            },
          },

          '&-info': {
            '&, &:focus, &.is-disabled[disabled]': {
              color: colors.white,
              backgroundColor: buttonColors.info.base,
            },
            '&:hover': {
              color: colors.white,
              backgroundColor: buttonColors.info.hover,
            },
            '&:active': {
              color: colors.white,
              backgroundColor: buttonColors.info.active,
            },
          },
          '&-danger': {
            '&, &:focus, &.is-disabled[disabled]': {
              color: colors.white,
              backgroundColor: buttonColors.danger.base,
            },
            '&:hover': {
              color: colors.white,
              backgroundColor: buttonColors.danger.hover,
            },
            '&:active': {
              color: colors.white,
              backgroundColor: buttonColors.danger.active,
            },
          },
        },
      }

      const icon = {
        '.arrow-icon': {
          transition: '0.3s transform',
          transform: 'rotate(0deg)',
          '&--open': {
            transform: 'rotate(-180deg)',
          },
        },
      }

      const popper = {
        '.el-popper.el-select__popper': {
          'border-radius': '8px',
        },
      }

      addComponents(modal)
      addComponents(input)
      addComponents(button)
      addComponents(icon)
      addComponents(popper)
    }),
    plugin(({ addDynamic, variants }) => {
      addDynamic('skew-y', ({ Utility, Style }) => {
        return Utility.handler
          .handleStatic(Style('skew-y'))
          .handleNumber(0, 300, 'int', (number) => `skewY(-${number}deg)`)
          .createProperty('transform')
      })
    }),
    plugin(({ addVariant }) => {
      addVariant('hocus', ({ modifySelectors }) => {
        return modifySelectors(({ className }) => {
          return `.${className}:hover:focus`
        })
      })
    }),
  ],
})
