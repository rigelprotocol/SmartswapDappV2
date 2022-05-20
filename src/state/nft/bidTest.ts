

const nameOfNFTsContracts = [ "RigelProtocol Smartswap NFTs", "Rigel Protocol LaunchPad NFTs", "Rigel Protocol GiftDapp NFT"];

export const getNftTokenID = (id: number, name: string) => {
    if (name === nameOfNFTsContracts[0]) {
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
    } else if (name === nameOfNFTsContracts[1]) {
        switch (id) {
            case 1:
                return Array.from({length: 10}, (_, i) => i + 1);

            case 2:
                return Array.from({length: 10}, (_, i) => i + 11);

            case 3:
                return Array.from({length: 10}, (_, i) => i + 21);

            case 4:
                return Array.from({length: 25}, (_, i) => i + 31);

            case 5:
                return Array.from({length: 25}, (_, i) => i + 56);

            case 6:
                return Array.from({length: 25}, (_, i) => i + 81);

            case 7:
                return Array.from({length: 300}, (_, i) => i + 106);

            case 8:
                return Array.from({length: 300}, (_, i) => i + 406);

            case 9:
                return Array.from({length: 300}, (_, i) => i + 706);

            case 10:
                return Array.from({length: 500}, (_, i) => i + 1006);

            case 11:
                return Array.from({length: 500}, (_, i) => i + 1506);

            case 12:
                return Array.from({length: 500}, (_, i) => i + 2006);

            default:
                return Array.from({length: 10}, (_, i) => i + 1);
        }
    } else if (name === nameOfNFTsContracts[2]) {
        switch (id) {
            case 31:
                return Array.from({length: 12}, (_, i) => i + 1);

            case 30:
                return Array.from({length: 12}, (_, i) => i + 13);

            case 29:
                return Array.from({length: 12}, (_, i) => i + 25);

            case 28:
                return Array.from({length: 30}, (_, i) => i + 37);

            case 27:
                return Array.from({length: 30}, (_, i) => i + 67);

            case 26:
                return Array.from({length: 30}, (_, i) => i + 97);

            case 25:
                return Array.from({length: 30}, (_, i) => i + 127);

            case 24:
                return Array.from({length: 30}, (_, i) => i + 157);

            case 23:
                return Array.from({length: 45}, (_, i) => i + 187);
        }
    }

};