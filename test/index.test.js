/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import helpers from 'yeoman-test'
import fs from 'node:fs'
import path from 'node:path'
import assert from 'yeoman-assert'
import yaml from 'js-yaml'

import AssetComputeWorker from '../index.js'
import Generator from 'yeoman-generator'

const composeWith = vi.spyOn(Generator.prototype, 'composeWith')
beforeAll(() => {
  // mock implementations
  composeWith.mockReturnValue(undefined)
})
beforeEach(() => {
  composeWith.mockClear()
})
afterAll(() => {
  composeWith.mockRestore()
})

describe('prototype', () => {
  test('exports a yeoman generator', () => {
    expect(AssetComputeWorker.prototype).toBeInstanceOf(Generator)
  })
})

function assertScripts () {
  const config = yaml.load(fs.readFileSync('src/dx-asset-compute-worker-1/ext.config.yaml').toString())
  assert.strictEqual(config.hooks.test, 'adobe-asset-compute asset-compute:test-worker')
  assert.strictEqual(config.hooks['post-app-run'], 'adobe-asset-compute asset-compute:devtool')
}

describe('run', () => {
  test('basic ext generator', async () => {
    const options = { 'skip-prompt': true }
    await helpers.run(AssetComputeWorker)
      .withOptions(options)
      .inTmpDir(dir => {
        fs.writeFileSync(path.join(dir, '.env'), 'FAKECONTENT')
      })
    expect(composeWith).toHaveBeenCalledTimes(1)
    expect(composeWith).toHaveBeenCalledWith(
      expect.objectContaining({
        Generator: expect.any(Generator.constructor),
        path: 'unknown'
      }),
      expect.any(Object))
    assertScripts()
  })
})
