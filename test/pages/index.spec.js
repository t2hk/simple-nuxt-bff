import { mount, shallowMount, createLocalVue, config, RouterLinkStub } from '@vue/test-utils'
import Vuex from 'vuex'
import IndexPage from '@/client/pages/index.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('index', () => {
  let wrapper

  // 事前処理
  beforeEach(() => {
    // 設定ファイルから設定値を読み込み、モックに設定する。
    const envParams = require(`@/config/env.${process.env.NODE_ENV}.json`)
    config.mocks.$config = {
      envMessage: envParams.test_message,
      apkKey: envParams.API_KEY
    }

    // vuex で保持する認証データを設定する。ここではひな形として定義しておく。各テストにて必要な値を設定すること。
    config.mocks.$auth = {
      loggedIn: false,
      user: {
        name: 'test user name'
      }
    }

    // コンポーネントをマウントし、ラッパが作成する。"nuxt-link" は RouterLinkStub でスタブ化する。
    // ここではひな形として定義しておく。config を変更する場合など、各テストにて作成しなおすこと。
    wrapper = mount(IndexPage, {
      stubs: {
        NuxtLink: RouterLinkStub
      },
      localVue
    })
  })

  it('リンクが1つで、/testであること。', () => {
    // リンク先が１つで、すべて正しく記述されていることを確認する。
    const links = wrapper.findAllComponents(RouterLinkStub)
    expect(links.length).toBe(1)
    expect(links.at(0).props().to).toBe('/test')
  })

  it('認証データのユーザ名が表示されること。', () => {
    expect(wrapper.html()).toContain('<p>USER NAME: ' + config.mocks.$auth.user.name + '</p>')
  })

  it('ログイン状態ではない場合、ログアウトボタンが表示されないこと。', () => {
    // ログアウト状態とし、ラッパを作成する。
    config.mocks.$auth.loggedIn = false
    wrapper = mount(IndexPage, {
      stubs: {
        NuxtLink: RouterLinkStub
      },
      localVue
    })
    expect(wrapper.find('#logoutButton').exists()).toBe(false)
  })

  it('ログイン状態の場合、ログアウトボタンが表示されること。', () => {
    // ログイン状態とし、ラッパを作成する。
    config.mocks.$auth.loggedIn = true
    wrapper = mount(IndexPage, {
      stubs: {
        NuxtLink: RouterLinkStub
      },
      localVue
    })
    expect(wrapper.find('#logoutButton').exists()).toBe(true)
  })

  it('メッセージ取得ボタン押下前のボタン名が"Get a message from API"であること。', async () => {
    const button = wrapper.find('#getMessageButton')
    expect(button.text()).toBe('Get a message from API')
  })

  it('メッセージ取得ボタンを押下すると、getMessage() が実行されること。', async () => {
    const button = wrapper.find('#getMessageButton')

    // vue の methods に定義している getMessage のモック化する。
    const spyExecuteGetMessage = jest.spyOn(wrapper.vm, 'getMessage')

    // ボタンを押すと getMessage が事項されることを確認する。
    button.trigger('click')
    expect(spyExecuteGetMessage).toHaveBeenCalled()
  })
})
