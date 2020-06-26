interface IComponentProps {
    id?: string;
    parentId?: string;
    flowKey?: string;
    items?: any[];
    isDesignTime?: boolean;
    children?: any;
    autofocusCandidate?: boolean;
}

export default IComponentProps;
