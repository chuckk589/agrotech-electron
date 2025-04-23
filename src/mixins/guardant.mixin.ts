import { computed } from "vue";
import { RetrieveSimulatorPopulated } from "../types";

export function useGuardant(product: RetrieveSimulatorPopulated) {
    const expDate = computed(() => {
        const { validUpToDate, containerDeathTime } = product.license;
        const dates = [validUpToDate, containerDeathTime].filter(v => v && v > 0);

        if (dates.length === 0) {
            return 0;
        }
        
        return Math.min(...[validUpToDate, containerDeathTime].filter(v => v && v > 0));
    });

    const isLimitedVersion = computed(() => {
        return product.license.licenseType !== 1 || product.license.isTrial;
    });

    return {
        expDate,
        isLimitedVersion,
    }
}
