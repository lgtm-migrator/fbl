# Context manipulation plugin

Upon flow execution each action handler gets access to shared context. 

Shared Context structure:

```yaml
# ctx is generally the place where non-secret transient data should be stored
ctx:
  key: value 
  
# place to store secrets, report will mask of secrets to prevent any security leakage  
secrets:
   key: secret

# action handlers may register entities they processed 
entities:
    # "registered" by convention should store all created or updated entities  
    registered:  
      - id: string | number
        type: string
        payload:
    
    # unregistered by convention should store all removed entities
    unregistered: []
    
    # only entities that were created, same entities should also exist in "registered" list
    created: []
    
    # only entities that were updated, same entities should also exist in "registered" list
    updated: []
    
    # only entities that were deleted, same entities should also exist in "unregistered" list
    deleted: []
    
```

(EJS)[http://ejs.co/] template can be used inside options to pass values from shared context. 
Please refer to plugin documentation if this feature supported and what options are required.

Example:

```yaml
version: 1.0.0
pipeline:
    plugin:
      # Pass "something" from "ctx" 
      contextValue: <%- ctx.something  %>
      # Pass "password" from "secrets"
      secretValue: <%- secrets.password %>
``` 

## Action Handler: Context Values Assignment

Assign non-secret values to context ("ctx"). May be used to provide "global" configuration. 

ID: com.fireblink.fbl.context.values

Aliases:
 - fbl.context.values
 - context.values
 - context
 - ctx
 
**Example 1: Assign values to context root directly:**

```yaml
ctx: 
  '.': 
    inline:
      something: true
      else: false  
```

**Example 2: Assign values from file "vars.yml" to field "vars.from.file":**

```yaml
ctx: 
  vars.from.file: 
    files: 
     - vars.yml    
```

**Example 3: Assign values from file "vars.yml" after inline ones:**
```yaml
ctx: 
  '.':
    inline: 
      test: true 
    files: 
     - vars.yml 
    # specify that files have a priority over inline vars
    # if not provided inline vars will have priority over files
    priority: 'files'   
```

## Action Handler: Secret Values Assignment

Same as above, but for secrets. All the options will me masked in report to prevent any security leakage. 

ID: com.fireblink.fbl.secret.values

Aliases:
 - fbl.secret.values
 - secret.values
 - secrets
 - secret
 
**Example 1: Assign values to secrets root directly:**
 
 ```yaml
 secrets: 
   '.': 
     inline:
       something: true
       else: false  
 ```
 
**Example 2: Assign values from file "vars.yml" to field "vars.from.file":**
 
 ```yaml
 secrets: 
   vars.from.file: 
     files: 
      - vars.yml    
 ```
 
 **Example 3: Assign values from file "vars.yml" after inline ones:**
 ```yaml
 secrets: 
   '.':
     inline: 
       test: true 
     files: 
      - vars.yml 
     # specify that files have a priority over inline vars
     # if not provided inline vars will have priority over files
     priority: 'files'   
 ```
 
## Action Handler: Mark entities as registered

Mark some entity as registered, meaning it supposed to exist.

Example use case: you want to keep some default entity upon cleanup that is not created/update with your script, 
but script itself in the end has some cleanup logic based on "registered" entities list. 

ID: com.fireblink.fbl.context.entities.registered

Aliases:
 - fbl.context.entities.registered
 - context.entities.registered
 - ctx.entities.registered
 
**Example:**
  
```yaml
ctx.entities.registered: 
    # Object type/class/etc
  - type: User
    # Entity Identity, can be a string or number
    id: 1002
    # Optional payload that may represent other or all fields of the entity
    payload:
      username: foobar        
```

## Action Handler: Mark entities as un-registered

Opposite to one above. Mark some entity to no longer exist. 

ID: com.fireblink.fbl.context.entities.registered

Aliases:
 - fbl.context.entities.unregistered
 - context.entities.unregistered
 - ctx.entities.unregistered
 
**Example:**
  
```yaml
ctx.entities.unregistered: 
    # Object type/class/etc
  - type: User
    # Entity Identity, can be a string or number
    id: 1002
    # Optional payload that may represent other or all fields of the entity
    payload:
      username: foobar        
```

## Action Handler: Mark entities as created

Mark some entity as just created. Will also register entity, so it will be presented in 2 places: `entities.registered` and `entities.created` 

ID: com.fireblink.fbl.context.entities.created

Aliases:
 - fbl.context.entities.created
 - context.entities.created
 - ctx.entities.created
 
**Example:**
  
```yaml
ctx.entities.created: 
    # Object type/class/etc
  - type: User
    # Entity Identity, can be a string or number
    id: 1002
    # Optional payload that may represent other or all fields of the entity
    payload:
      username: foobar        
```

## Action Handler: Mark entities as updated

Mark some entity as just updated. Will also register entity, so it will be presented in 2 places: `entities.registered` and `entities.updated` 

ID: com.fireblink.fbl.context.entities.updated

Aliases:
 - fbl.context.entities.updated
 - context.entities.updated
 - ctx.entities.updated
 
**Example:**
  
```yaml
ctx.entities.created: 
    # Object type/class/etc
  - type: User
    # Entity Identity, can be a string or number
    id: 1002
    # Optional payload that may represent other or all fields of the entity
    payload:
      username: foobar        
```

## Action Handler: Mark entities as deleted

Mark some entity as just deleted. Will also un-register entity, so it will be presented in 2 places: `entities.unregistered` and `entities.deleted` 

ID: com.fireblink.fbl.context.entities.deleted

Aliases:
 - fbl.context.entities.deleted
 - context.entities.deleted
 - ctx.entities.deleted
 
**Example:**
  
```yaml
ctx.entities.deleted: 
    # Object type/class/etc
  - type: User
    # Entity Identity, can be a string or number
    id: 1002
    # Optional payload that may represent other or all fields of the entity
    payload:
      username: foobar        
```