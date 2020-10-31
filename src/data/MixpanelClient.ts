import * as mixpanel from 'mixpanel-browser';

export default class MixpanelClient {
    private static instance: MixpanelClient;

    private constructor() {
        mixpanel.init("5c1884fb955d816125cf100da2441608");
    }

    public static getInstance(): MixpanelClient {
        if (!MixpanelClient.instance) {
            MixpanelClient.instance = new MixpanelClient();
        }

        return MixpanelClient.instance;
    }

    public track(eventName: string, properties?: mixpanel.Dict | undefined, callback?: (() => void) | undefined): void {
        mixpanel.track(eventName, properties, callback);
    }

    public alias(uniqueId: string) {
        mixpanel.alias(uniqueId);
    }

    public peopleSet(dict: mixpanel.Dict) {
        mixpanel.people.set(dict);
    }

  
}