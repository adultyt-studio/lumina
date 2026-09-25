// src/types/design.ts

export type ElementType = 'text' | 'image' | 'shape' | 'glass-panel';

export interface Keyframe {
  time: number; // ms from start
  properties: Partial<Pick<BaseElement, 'x' | 'y' | 'width' | 'height' | 'rotation' | 'opacity'>>;
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'bounce';
}

export interface AnimationConfig {
  id: string;
  name: string;
  duration: number; // total ms
  keyframes: Keyframe[];
  loop: boolean;
  delay: number;
  fillMode: 'forwards' | 'backwards' | 'both';
}

export interface BaseElement {
  id: string;
  type: ElementType;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  locked: boolean;
  zIndex: number;
  animation?: AnimationConfig;
}

export interface TextElement extends BaseElement {
  type: 'text';
  content: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  color: string;
  textAlign: 'left' | 'center' | 'right';
  lineHeight: number;
  letterSpacing: number;
}

export interface ImageElement extends BaseElement {
  type: 'image';
  src: string;
  objectFit: 'cover' | 'contain' | 'fill';
  borderRadius: number;
  filter: string; // blur, brightness, contrast
}

export interface ShapeElement extends BaseElement {
  type: 'shape';
  shapeType: 'rectangle' | 'circle' | 'triangle' | 'polygon';
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  borderRadius: number;
  gradient?: {
    type: 'linear' | 'radial';
    colors: string[];
    angle: number;
  };
}

export interface GlassPanelElement extends BaseElement {
  type: 'glass-panel';
  blurAmount: number; // px
  glassOpacity: number; // 0-100%
  cornerRadius: number;
  borderColor: string;
  borderWidth: number;
  shadowIntensity: number;
  liquidEffect: boolean; // morphing animation
  content?: string;
}

export type DesignElement = TextElement | ImageElement | ShapeElement | GlassPanelElement;

export interface Frame {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  backgroundColor: string;
  elements: DesignElement[];
  visible: boolean;
}
