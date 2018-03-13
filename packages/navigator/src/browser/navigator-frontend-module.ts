/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { ContainerModule } from 'inversify';
import { MenuContribution } from '@theia/core/lib/common';
import { FrontendApplicationContribution, KeybindingContribution } from "@theia/core/lib/browser";
import { FileNavigatorWidget, FILE_NAVIGATOR_ID } from "./navigator-widget";
import { NavigatorMenuContribution } from './navigator-menu';
import { FileNavigatorContribution } from './navigator-contribution';
import { createFileNavigatorWidget } from "./navigator-container";
import { WidgetFactory } from '@theia/core/lib/browser/widget-manager';
import { CommandContribution } from '@theia/core/lib/common/command';
import { bindFileNavigatorPreferences } from './navigator-preferences';
import { FileNavigatorFilter } from './navigator-filter';
import { NavigatorTreeDecorator } from './navigator-decorator-service';
import { FuzzySearch } from './fuzzy-search';
import { FileNavigatorSearch } from './navigator-search';
import { Throttle, ThrottleOptions } from './throttle';
import { SearchBoxWidget, SearchBoxWidgetProps, SearchBoxWidgetFactory } from './search-box-widget';

import '../../src/browser/style/index.css';

export default new ContainerModule(bind => {
    bindFileNavigatorPreferences(bind);
    bind(FileNavigatorFilter).toSelf().inSingletonScope();
    bind(FileNavigatorContribution).toSelf().inSingletonScope();
    bind(FrontendApplicationContribution).toDynamicValue(c => c.container.get(FileNavigatorContribution));
    bind(CommandContribution).toDynamicValue(c => c.container.get(FileNavigatorContribution));
    bind(KeybindingContribution).toDynamicValue(c => c.container.get(FileNavigatorContribution));
    bind(MenuContribution).toDynamicValue(c => c.container.get(FileNavigatorContribution));
    bind(MenuContribution).to(NavigatorMenuContribution).inSingletonScope();

    bind(FuzzySearch).toSelf().inSingletonScope();
    bind(FileNavigatorSearch).toSelf().inSingletonScope();
    bind(NavigatorTreeDecorator).toService(FileNavigatorSearch);
    bind(ThrottleOptions).toConstantValue(ThrottleOptions.DEFAULT);
    bind(Throttle).toSelf();
    bind(SearchBoxWidget).toSelf();
    bind(SearchBoxWidgetFactory).toFactory(context =>
        (props: SearchBoxWidgetProps) => {
            const { container } = context;
            const { delay } = props;
            container.bind(ThrottleOptions).toConstantValue({ delay });
            container.bind(SearchBoxWidgetProps).toConstantValue(props);
            return container.get(SearchBoxWidget);
        }
    );

    bind(FileNavigatorWidget).toDynamicValue(ctx =>
        createFileNavigatorWidget(ctx.container)
    );
    bind(WidgetFactory).toDynamicValue(context => ({
        id: FILE_NAVIGATOR_ID,
        createWidget: () => context.container.get<FileNavigatorWidget>(FileNavigatorWidget)
    }));
});
