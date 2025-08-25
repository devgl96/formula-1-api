export interface TeamsProps {
    id: string | number;
    name: string;
    base: string;
}

export interface DriversProps {
    id: string | number;
    name: string;
    team: string;
    nationality: string;
    driverNumber: number;
}

export interface ParamsProps {
    id: string;
}