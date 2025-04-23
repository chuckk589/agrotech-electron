import { computed } from "vue";
import { RetrieveSimulatorPopulated } from "../types";

export function useGuardant(product: RetrieveSimulatorPopulated) {
    const expDate = computed(() => {
        const { validUpToDate, containerDeathTime } = product.license;
        return Math.min(...[validUpToDate, containerDeathTime].filter(v => v > 0)) || 0;
    });
    
    const isLimitedVersion = computed(() => {
        return product.license.licenseType !== 1 || product.license.isTrial;
    });

    return {
        expDate,
        isLimitedVersion,
    }
}
