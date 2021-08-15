import { expect } from '@jest/globals'
// import { mount, shallowMount, createLocalVue, config, RouterLinkStub } from '@vue/test-utils'
import sample1 from '../../api/sample1.js'
import verifyToken from '../../api/verify-token.js'
const request = require('supertest')
const jwt = require('jsonwebtoken')

// verify-token をモック化する。
jest.mock('../../api/verify-token.js')

let envParams

describe('sample1', () => {
  // 事前準備
  beforeEach(() => {
    // モックを初期化する。
    verifyToken.mockClear()

    // テスト用の設定値を読み込む。
    envParams = require(`@/config/env.${process.env.NODE_ENV}.json`)
  })

  it('call /message', async () => {
    // verifyToken のモックの実装を正常終了させる内容とする。
    verifyToken.mockImplementation(() => {
      return {}
    })

    // sample1 の /message を呼び出し、正常終了することを確認する。
    const res = await request(sample1)
      .get('/message')
      .set('access-token', 'testtoken')
      .send({})

    // HTTP ステータスコードが 200 であること、取得したメッセージが、設定ファイルの api_message と同じであることを確認する。
    expect(res.status).toEqual(200)
    expect(res.text).toEqual(envParams.api_message)
  })

  it('call /message and return exception', async () => {
    const errorMessage = '/message API throws a exception.'
    verifyToken.mockImplementation(() => {
      throw new Error(errorMessage)
    })

    const res = await request(sample1)
      .get('/message')
      .set('access-token', 'testtoken')
      .send({})

    // HTTP ステータスコードが 401であること、取得したメッセージがトークンチェックに失敗した際の例外メッセージであることを確認する。
    expect(res.status).toEqual(401)
    expect(res.text).toEqual(errorMessage)
  })
})
