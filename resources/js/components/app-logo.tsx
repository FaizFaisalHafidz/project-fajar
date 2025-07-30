export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-white border border-gray-200 shadow-sm">
                <img 
                    src="https://neoflash.sgp1.cdn.digitaloceanspaces.com/logo-smk-mohammad-toha.png" 
                    alt="Logo SMK Mohammad Toha" 
                    className="size-6 object-contain"
                />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">SMK Mohammad Toha</span>
                <span className="truncate text-xs text-muted-foreground">Sistem Informasi Akademik</span>
            </div>
        </>
    );
}
