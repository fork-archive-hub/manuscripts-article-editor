/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */
import { CitationProvider } from '@manuscripts/library';
import { ContainedModel } from '@manuscripts/manuscript-transform';
import { BibliographyItem, Bundle } from '@manuscripts/manuscripts-json-schema';
import { Collection } from '../sync/Collection';
export interface BiblioTools {
    getCitationProvider: () => CitationProvider | undefined;
    getLibraryItem: (id: string) => BibliographyItem | undefined;
    setLibraryItem: (item: BibliographyItem) => void;
    matchLibraryItemByIdentifier: (item: BibliographyItem) => BibliographyItem | undefined;
    filterLibraryItems: (query: string) => Promise<BibliographyItem[]>;
}
export declare class Biblio implements BiblioTools {
    citationProvider: CitationProvider;
    library: Map<string, BibliographyItem>;
    getLibraryItem: (id: string) => BibliographyItem | undefined;
    setLibraryItem: (item: BibliographyItem) => any;
    constructor(bundle: Bundle, library: Map<string, BibliographyItem>, collection: Collection<ContainedModel>, lang: string);
    matchLibraryItemByIdentifier: (item: BibliographyItem) => BibliographyItem | undefined;
    filterLibraryItems: (query: string) => Promise<BibliographyItem[]>;
    getCitationProvider: () => CitationProvider;
    getTools: () => {
        filterLibraryItems: (query: string) => Promise<BibliographyItem[]>;
        matchLibraryItemByIdentifier: (item: BibliographyItem) => BibliographyItem | undefined;
        setLibraryItem: (item: BibliographyItem) => any;
        getCitationProvider: () => CitationProvider;
        getLibraryItem: (id: string) => BibliographyItem | undefined;
    };
}
