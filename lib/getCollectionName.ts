/**
 * Given the active tab, returns the name of the Firestore collection
 * that it corresponds to.
 *
 * @param {string} activeTab - The active tab, which should be one of
 * 'ashas', 'doctors', 'nurses', 'hospitals', or 'patients'.
 *
 * @returns {string} The name of the Firestore collection that corresponds
 * to the active tab.
 *
 * @throws {Error} If the `activeTab` is not one of the supported values.
 */
export const getCollectionName = (activeTab: string): string => {
    switch (activeTab) {
        case 'ashas':
        case 'doctors':
        case 'nurses':
            return 'users';
        case 'hospitals':
            return 'hospitals';
        case 'patients':
            return 'patients';
        default:
            throw new Error(`Unsupported activeTab value: ${activeTab}`);
    }
};
