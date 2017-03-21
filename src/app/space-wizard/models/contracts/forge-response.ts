export interface IForgeValueChoice {
  id: string;// "Spring Boot",
  description:string;
  requiredFacets?: string;// "[interface org.jboss.forge.addon.projects.facets.MetadataFacet, interface org.jboss.forge.addon.projects.facets.PackagingFacet, interface org.jboss.forge.addon.projects.facets.DependencyFacet, interface org.jboss.forge.addon.projects.facets.ResourcesFacet, interface org.jboss.forge.addon.projects.facets.WebResourcesFacet, interface org.jboss.forge.addon.parser.java.facets.JavaSourceFacet, interface org.jboss.forge.addon.parser.java.facets.JavaCompilerFacet]",
  setupFlow?: string;// "class io.fabric8.forge.devops.springboot.SpringBootSetupFlow"
  type?: string;// "Spring Boot"
  repository?: any;
  version?: string;
  groupId?:string;
  goals?:string;
  properties?:any;
  // other properties
  [key:string]:any;
}

export interface IForgeField {
  name: string;// "type",
  shortName: string;// " ",
  label: string;// "Project type",
  valueType: string;// "org.jboss.forge.addon.projects.ProjectType",
  value: string;// "Spring Boot"//id
  inputType: string;// "org.jboss.forge.inputType.DEFAULT",
  enabled: boolean;// true;
  required: boolean;// true;
  deprecated: boolean;// false;
  description: string;// "",
  valueChoices?: Array<IForgeValueChoice>;
  class: string;// "UISelectOne",
  // other properties
  [key:string]:any;
}

export interface IForgePayload {
  metadata: {
    deprecated: boolean,
    category: string,
    name: string,
    description: string
    [key:string]:any;
  }
  state: {
    valid: boolean,
    canExecute: boolean,
    wizard: boolean,
    canMoveToNextStep: boolean,
    canMoveToPreviousStep: boolean
    [key:string]:any;
  }
  input: Array<IForgeField>;
  [key:string]:any;
  
}


export interface IForgeResponse {
  payload: IForgePayload|any ;
}

