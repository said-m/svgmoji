
declare module "*.ico" {
    const content: any;
    export default content;
}

declare module "*.png" {
    const content: any;
    export default content;
}

declare module "*.svg" {
    const content: any;
    export default content;
}

declare module "*.jpg" {
    const content: any;
    export default content;
}

declare module '*.scss' {
    export const content: {
        [className: string]: string,
    };
    export default content;
}

declare module "*.svelte" {
    const content: any;
    export default content;
}
