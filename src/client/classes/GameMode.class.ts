import {
  Engine,
  HemisphericLight,
  SpotLight,
  FreeCamera,
  Scene,
  Vector3,
  SceneLoader,
  Color3,
  Nullable,
  ISceneLoaderPlugin,
  ISceneLoaderPluginAsync
} from '@babylonjs/core'

import { Board } from './Board.class'
import { GUIManager } from './GUIManager.class'
import { GameOutcome } from '../../shared/GameOutcome'

import '@babylonjs/loaders'
import 'lodash'

export class GameMode {
  GUIManager: GUIManager
  canvas: HTMLCanvasElement
  engine: Engine
  scene: Scene
  camera: FreeCamera
  board: Board
  smallCount: number
  bigCount: number
  bonusCount: number
  coins: number
  earnings: number
  bet: number
  machineMesh: Nullable<ISceneLoaderPlugin | ISceneLoaderPluginAsync>

  constructor() {
    this.GUIManager = new GUIManager()
    this.canvas = document.createElement('canvas')
    this.engine = new Engine(this.canvas)
    this.scene = new Scene(this.engine)
    this.scene.autoClear = false
    this.smallCount = 0
    this.bigCount = 0
    this.bonusCount = 0
    this.coins = 10000
    this.earnings = 0
    this.bet = 50
    this.board = new Board(this.scene)
    this.camera = new FreeCamera('camera1', new Vector3(0, 0.7, -2), this.scene)
    this.camera.rotation.z = 1.5
    this.machineMesh = null
  }

  updateScoreAndCounters(outcome: GameOutcome) {
    setTimeout(() => {
      this.updateScore(outcome)
      this.updateCounters()

      if (this.GUIManager.checkBox?.isChecked && !outcome.bonus) {
        this.GUIManager.buttonPressedToggle()
        this.playButtonCallback()
      }
    }, 3600)
  }

  updateCounters() {
    this.GUIManager.updateAllCounters(
      this.smallCount,
      this.bigCount,
      this.bonusCount,
      this.coins,
      this.earnings,
      this.bet
    )
  }

  bonusRoll() {
    this.GUIManager.buttonPressedToggle()
    this.shuffleBoard()
  }

  updateScore(outcome: GameOutcome) {
    if (outcome.smallWin) {
      this.smallCount++
      this.coins += this.bet * 2
      this.earnings += this.bet * 2
      document.body.classList.add('smallBonus')
      document.getElementById('smallwin')?.classList.add('won')
      setTimeout(() => {
        document.body.classList.remove('smallBonus')
        document.getElementById('smallwin')?.classList.remove('won')
      }, 2000)
    }

    if (outcome.bigWin) {
      this.bigCount++
      this.coins += this.bet * 5
      this.earnings += this.bet * 5
      document.body.classList.add('bigBonus')
      document.getElementById('bigwin')?.classList.add('won')

      setTimeout(() => {
        document.body.classList.remove('bigBonus')
        document.getElementById('bigwin')?.classList.remove('won')
      }, 2000)
    }

    if (outcome.bonus) {
      this.bonusCount++
      this.bonusRoll()
      document.getElementById('bonus')?.classList.add('won')
      setTimeout(() => {
        document.getElementById('bonus')?.classList.remove('won')
      }, 2000)
    }
  }

  shuffleBoard() {
    this.scene.animationGroups.forEach(anim => {
      anim.speedRatio = 5
      anim.play()
    })

    this.board.shuffleBoard((outcome: GameOutcome) =>
      this.updateScoreAndCounters(outcome)
    )
  }

  updateBet(value: number) {
    this.bet = Math.round(value)
    this.GUIManager.updateBetCounter(this.bet)
  }

  playButtonCallback() {
    this.coins -= this.bet
    this.earnings -= this.bet
    this.shuffleBoard()
  }

  private initializeBabylonApp() {
    this.GUIManager.loadUi(
      () => this.playButtonCallback(),
      (value: number) => this.updateBet(value),
      () => this.updateCounters()
    )

    this.CreateScene()

    this.board.standBy()
    this.engine.resize()
    this.engine.runRenderLoop(() => {
      this.scene.render()
    })

    window.addEventListener('resize', () => {
      this.engine.resize()
    })

    this.machineMesh = SceneLoader.ImportMesh(
      '',
      'https://raw.githubusercontent.com/NAMazitelli/pokeslot/main/public/',
      'Machine.glb',
      this.scene,
      (_m, _a, _b, animationGroups) => {
        animationGroups.forEach(function (animationGroup) {
          animationGroup.stop()
        })
        setTimeout(
          () => document.getElementById('loader')?.classList.add('hidden'),
          300
        )
      }
    )
  }

  public setup = () => {
    const container = document.getElementById('container')
    this.canvas.id = 'renderCanvas'

    if (container) {
      container.appendChild(this.canvas)
    }

    this.initializeBabylonApp()
  }

  private CreateScene() {
    this.camera.setTarget(new Vector3(0, 0, 1.5))
    const hemisphericLight = new HemisphericLight(
      'light1',
      new Vector3(0, 15, -15),
      this.scene
    )
    hemisphericLight.intensity = 10
    hemisphericLight.specular = Color3.Black()
    const spotLight = new SpotLight(
      'spotLight',
      new Vector3(0, 6, -15),
      new Vector3(0, -1, 1),
      Math.PI / 3,
      2,
      this.scene
    )
    spotLight.intensity = 0
  }
}
