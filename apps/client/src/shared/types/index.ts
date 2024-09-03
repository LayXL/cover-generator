export type Community = {
  id: number
  name: string
  avatar?: string
  coverUrl?: string
}

type SolidBackground = {
  type: "solid"
  color: string
}

type GradientBackground = {
  type: "gradient"
  colors: string[]
  angle: number
  style: "linear" | "radial"
}

type ImageBackground = {
  type: "image"
  style: "repeat" | "cover" | "contain"
} & ({ url: string } | { base64: string })

export type Background = SolidBackground | GradientBackground | ImageBackground

export type Icon = {
  name: string
  size: number
  color: string
}

export type Text = {
  value: string
  color: string
  fontSize: number
}

export type Cover = {
  title?: string
  bg: Background
  text?: Text
  icon?: Icon
}

export type Project = {
  title: string
  community?: Community
  covers: Cover[]
}

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T
