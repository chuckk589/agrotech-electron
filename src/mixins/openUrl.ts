// src/mixins/useOpenUrl.ts
export function useOpenUrl() {
    const openUrl = (event: any, url: string) => {
        event.preventDefault();
        window.shell.openUrl(url);
    };

    return { openUrl };
}