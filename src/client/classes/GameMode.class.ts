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
  // rendering
  canvas: HTMLCanvasElement
  engine: Engine
  scene: Scene
  camera: FreeCamera

  // GUI Manager
  GUIManager: GUIManager
  board: Board

  // score counters
  smallCount: number
  bigCount: number
  bonusCount: number
  coins: number
  earnings: number
  bet: number

  // mesh
  machineMesh: Nullable<ISceneLoaderPlugin | ISceneLoaderPluginAsync>

  constructor() {
    this.canvas = document.createElement('canvas')
    this.engine = new Engine(this.canvas)

    this.scene = new Scene(this.engine)
    this.scene.autoClear = false

    this.camera = new FreeCamera('camera1', new Vector3(0, 0.7, -2), this.scene)
    this.camera.rotation.z = 1.5

    this.GUIManager = new GUIManager()
    this.board = new Board(this.scene)

    this.smallCount = 0
    this.bigCount = 0
    this.bonusCount = 0
    this.coins = 10000
    this.earnings = 0
    this.bet = 50
    this.machineMesh = null
  }

  // update score and counters
  updateScoreAndCounters(outcome: GameOutcome) {
    this.updateScore(outcome)
    this.updateCounters()
  }

  // update all counters on the ui
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

  // perform a bonus roll
  bonusRoll() {
    this.bonusCount++
    this.GUIManager.buttonPressedToggle()
    this.shuffleBoard()
    document.getElementById('bonus')?.classList.add('won')
    setTimeout(() => {
      document.getElementById('bonus')?.classList.remove('won')
    }, 2000)
  }

  // small win scored
  smallWin() {
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

  // big win scored
  bigWin() {
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

  // update score according to the game outcome.
  updateScore(outcome: GameOutcome) {
    if (outcome.smallWin) {
      this.smallWin()
    }

    if (outcome.bigWin) {
      this.bigWin()
    }

    if (outcome.bonus) {
      this.bonusRoll()
    }
  }

  // get a fresh board
  shuffleBoard() {
    // play lever animation
    this.scene.animationGroups.forEach(anim => {
      anim.speedRatio = 5
      anim.play()
    })

    // get a new board
    this.board.shuffleBoard((outcome: GameOutcome) => {
      document.body.style.cursor = 'default'
      setTimeout(() => {
        this.updateScoreAndCounters(outcome)
        // auto play
        if (this.GUIManager.checkBox?.isChecked && !outcome.bonus) {
          this.GUIManager.buttonPressedToggle()
          this.playButtonCallback()
        }
      }, 3600)
    })
  }

  // update the bet amount
  updateBet(value: number) {
    this.bet = Math.round(value)
    this.GUIManager.updateBetCounter(this.bet)
  }

  // play button action
  playButtonCallback() {
    this.coins -= this.bet
    this.earnings -= this.bet
    this.shuffleBoard()
  }

  // init babylon
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

  // setup
  public setup() {
    const container = document.getElementById('container')
    this.canvas.id = 'renderCanvas'

    if (container) {
      container.appendChild(this.canvas)
    }

    this.initializeBabylonApp()
  }

  // create the scene, setup lights
  private CreateScene() {
    this.camera.setTarget(new Vector3(0, 0, 1.5))
    const hemisphericLight = new HemisphericLight(
      'light1',
      new Vector3(0, 15, -15),
      this.scene
    )
    hemisphericLight.intensity = 3
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
