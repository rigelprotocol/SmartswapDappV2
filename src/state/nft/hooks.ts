

export const getNftToken = (id: number) => {
    switch (id) {
        case 1:
            return Array.from({length: 17}, (_, i) => i + 1);

        case 2:
            return Array.from({length: 17}, (_, i) => i + 26);

        case 3:
            return Array.from({length: 17}, (_, i) => i + 51);

        case 4:
            return Array.from({length: 180}, (_, i) => i + 76);

        case 5:
            return Array.from({length: 180}, (_, i) => i + 376);

        case 6:
            return Array.from({length: 350}, (_, i) => i + 676);

        case 7:
            return Array.from({length: 300}, (_, i) => i + 1176);

        case 8:
            return Array.from({length: 300}, (_, i) => i + 1676);

        case 9:
            return Array.from({length: 700}, (_, i) => i + 2176);

        case 10:
            return Array.from({length: 700}, (_, i) => i + 3176);

        case 11:
            return Array.from({length: 700}, (_, i) => i + 4176);

        case 12:
            return Array.from({length: 700}, (_, i) => i + 5176);

        case 13:
            return Array.from({length: 700}, (_, i) => i + 6176);

        case 14:
            return Array.from({length: 700}, (_, i) => i + 7176);

        default:
            return Array.from({length: 17}, (_, i) => i + 1);
    }
};

export const getNftTokenPolygon = (id: number) => {
    switch (id) {
        case 1:
            return Array.from({length: 17}, (_, i) => i + 1);

        case 2:
            return Array.from({length: 17}, (_, i) => i + 26);

        case 3:
            return Array.from({length: 17}, (_, i) => i + 51);

        case 4:
            return Array.from({length: 17}, (_, i) => i + 76);

        case 5:
            return Array.from({length: 180}, (_, i) => i + 101);

        case 6:
            return Array.from({length: 180}, (_, i) => i + 401);

        case 7:
            return Array.from({length: 180}, (_, i) => i + 701);

        case 8:
            return Array.from({length: 350}, (_, i) => i + 1001);

        case 9:
            return Array.from({length: 300}, (_, i) => i + 1501);

        case 10:
            return Array.from({length: 300}, (_, i) => i + 2001);

        case 11:
            return Array.from({length:300}, (_, i) => i + 2501);

        case 12:
            return Array.from({length: 700}, (_, i) => i + 3001);

        default:
            return Array.from({length: 25}, (_, i) => i + 1);
    }
};