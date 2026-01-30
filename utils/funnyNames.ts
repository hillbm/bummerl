export const FUNNY_NAMES = [
    "Bummerlkönig",
    "Schnapsdrossel",
    "Pechvogel",
    "Glückspilz",
    "Kartengott",
    "Wirtshauslegende",
    "Bummerl-Sammler",
    "Herz-Ass",
    "Pik-Bube",
    "Stich-Meister",
    "Schummel-Liesl",
    "Bluff-Baron",
    "Trumpf-Kaiser",
    "Unter-Jager",
    "Ober-Stecher",
    "Grantler",
    "Zocker-Sepp",
    "Misch-Masch",
    "Schneider-Franz",
    "Null-Spieler",
    "Flecken-Zwerg",
    "Sauf-Kumpan",
    "Karten-Hai",
    "Bier-Dimpfl",
    "Oide Haut",
    "Jungspund",
    "Grand-Hand",
    "Ramsch-König",
    "Bettel-Student",
    "Schafkopf",
    "Gras-Ober",
    "Schelln-Sau",
    "Eichel-Unter",
    "Herz-Dame",
    "Maxi",
    "Susi",
    "Hansi",
    "Gerti"
];

export function getRandomName(currentName: string): string {
    let newName = currentName;
    let attempts = 0;
    // Try to get a new name that isn't the current one, but prevent infinite loops
    while (newName === currentName && attempts < 10) {
        const randomIndex = Math.floor(Math.random() * FUNNY_NAMES.length);
        newName = FUNNY_NAMES[randomIndex];
        attempts++;
    }
    return newName;
}
