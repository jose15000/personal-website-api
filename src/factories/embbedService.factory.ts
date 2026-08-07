import { EmbbedingService } from "../services/embedding.service";

let initPromise: Promise<EmbbedingService> | null = null;

export function EmbbedingServiceFactory(): Promise<EmbbedingService> {
    if (!initPromise) {
        initPromise = (async () => {
            const svc = new EmbbedingService();
            await svc.initialize();
            return svc;
        })();
    }
    return initPromise;
}