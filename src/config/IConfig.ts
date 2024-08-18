interface IEnvironmentConfig {
    port: number;
    mongoUri: string;
}

interface IConfig {
    development: IEnvironmentConfig;
    production: IEnvironmentConfig;
}

export default IConfig;