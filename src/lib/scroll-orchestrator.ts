import { useSyncExternalStore } from "react";

// Laco unico de rolagem compartilhado pelas secoes da home (Projetos e Trajetoria).
// Um listener de scroll (fase de captura, entao pega a pagina e os trilhos
// horizontais), um requestAnimationFrame por quadro, um ResizeObserver e uma
// consulta de movimento reduzido. Cada secao registra um controlador; a medicao
// segue a ordem do documento, de cima para baixo, porque a altura do sticky dos
// Projetos desloca tudo o que vem depois dele.

export type ScrollFrame = {
  scrollY: number;
  viewportHeight: number;
  /** Altura do cabecalho fixo (mesmo valor do scroll-padding das ancoras). */
  headerOffset: number;
  maxScroll: number;
};

export type ScrollController = {
  /** Raiz da secao: define a posicao do controlador na ordem de medicao. */
  element: Element;
  /**
   * Le a geometria e guarda em cache. Retorne false quando a secao for trocar de
   * layout: as secoes abaixo so medem no refresh seguinte, ja com o layout novo.
   */
  measure(frame: ScrollFrame): boolean | void;
  /** Le valores baratos do quadro (ex.: scrollLeft de um trilho). Nao escreve estilos. */
  read?(frame: ScrollFrame): void;
  /** Escreve estilos a partir do cache. Nao le layout. */
  write(frame: ScrollFrame): void;
};

const controllers: ScrollController[] = [];
let frameId = 0;
let dirty = true;
let headerOffset = 0;
let maxScroll = 0;
let resizeObserver: ResizeObserver | null = null;

function currentFrame(): ScrollFrame {
  return {
    scrollY: window.scrollY,
    viewportHeight: window.innerHeight,
    headerOffset,
    maxScroll,
  };
}

// So a barra do cabecalho conta: o menu mobile aberto aumenta o <header>, mas
// fecha ao escolher um link, e as ancoras nao podem parar abaixo dele.
function measureHeader() {
  const bar = document.querySelector("[data-header-bar]");
  const header = bar?.closest("header");
  let next = 0;
  if (bar && header) {
    const border = parseFloat(getComputedStyle(header).borderBottomWidth) || 0;
    next = Math.ceil(bar.getBoundingClientRect().height + border);
  }
  if (next !== headerOffset) {
    headerOffset = next;
    document.documentElement.style.setProperty("--header-offset", `${next}px`);
  }
}

// Retorna false se algum controlador interrompeu a medicao (troca de layout pendente).
function run(): boolean {
  if (frameId) cancelAnimationFrame(frameId);
  frameId = 0;
  let complete = true;

  if (dirty) {
    dirty = false;
    measureHeader();
    maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const frame = currentFrame();
    for (const controller of controllers) {
      if (controller.measure(frame) === false) {
        complete = false;
        break;
      }
    }
  }

  // Primeiro todas as leituras, depois todas as escritas.
  const frame = currentFrame();
  for (const controller of controllers) controller.read?.(frame);
  for (const controller of controllers) controller.write(frame);
  return complete;
}

function requestFrame() {
  if (!frameId) frameId = requestAnimationFrame(() => run());
}

/** Agenda nova medicao de todas as secoes no proximo quadro. */
export function invalidateScroll() {
  dirty = true;
  requestFrame();
}

/**
 * Mede (de cima para baixo) e escreve agora, sem esperar o proximo quadro. Usado
 * logo depois de uma troca de modo, antes da pintura. Retorna false se outra
 * troca de layout foi pedida durante a medicao.
 */
export function refreshScroll(): boolean {
  dirty = true;
  return run();
}

/** Escreve agora com as medidas em cache (ex.: depois de um scrollTo instantaneo). */
export function flushScroll() {
  run();
}

export function getHeaderOffset() {
  return headerOffset;
}

function onLoadCapture(event: Event) {
  if (event.target instanceof HTMLImageElement) invalidateScroll();
}

function attach() {
  document.addEventListener("scroll", requestFrame, { capture: true, passive: true });
  window.addEventListener("resize", invalidateScroll);
  document.addEventListener("load", onLoadCapture, true);
  resizeObserver = new ResizeObserver(invalidateScroll);
  resizeObserver.observe(document.body);
  const bar = document.querySelector("[data-header-bar]");
  if (bar) resizeObserver.observe(bar);
  document.fonts?.ready.then(invalidateScroll);
  document.fonts?.addEventListener?.("loadingdone", invalidateScroll);
}

function detach() {
  document.removeEventListener("scroll", requestFrame, { capture: true });
  window.removeEventListener("resize", invalidateScroll);
  document.removeEventListener("load", onLoadCapture, true);
  resizeObserver?.disconnect();
  resizeObserver = null;
  document.fonts?.removeEventListener?.("loadingdone", invalidateScroll);
  if (frameId) cancelAnimationFrame(frameId);
  frameId = 0;
}

/** Registra uma secao no laco. Retorna a funcao que a remove. */
export function registerScrollController(controller: ScrollController) {
  const index = controllers.findIndex(
    (other) =>
      other.element.compareDocumentPosition(controller.element) &
      Node.DOCUMENT_POSITION_PRECEDING,
  );
  controllers.splice(index === -1 ? controllers.length : index, 0, controller);
  if (controllers.length === 1) attach();
  resizeObserver?.observe(controller.element);
  invalidateScroll();

  return () => {
    const position = controllers.indexOf(controller);
    if (position !== -1) controllers.splice(position, 1);
    resizeObserver?.unobserve(controller.element);
    if (controllers.length === 0) detach();
    else invalidateScroll();
  };
}

// Uma MediaQueryList (e um listener) por consulta, compartilhada por quem usar.
type MediaStore = { subscribe(listener: () => void): () => void; get(): boolean };
const mediaStores = new Map<string, MediaStore>();

function mediaStore(query: string): MediaStore {
  let store = mediaStores.get(query);
  if (store) return store;

  let list: MediaQueryList | null = null;
  const listeners = new Set<() => void>();
  const onChange = () => {
    listeners.forEach((listener) => listener());
    invalidateScroll();
  };

  store = {
    subscribe(listener) {
      if (!list) {
        list = window.matchMedia(query);
        list.addEventListener("change", onChange);
      }
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0 && list) {
          list.removeEventListener("change", onChange);
          list = null;
        }
      };
    },
    get: () => (list ?? window.matchMedia(query)).matches,
  };
  mediaStores.set(query, store);
  return store;
}

/** No servidor (e na hidratacao) retorna false; depois acompanha a consulta. */
export function useMediaQuery(query: string) {
  const store = mediaStore(query);
  return useSyncExternalStore(store.subscribe, store.get, () => false);
}

export function useReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
