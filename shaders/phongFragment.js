// define the Phong fragment shader
export const phongFragmentShader = `
uniform vec3 uMaterialColor;
uniform vec3 uLightColor;

varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
    // calculate the normal in view space
    vec3 normal = normalize(vNormal);

    // calculate the light direction in view space
    vec3 lightDirection = normalize(vViewPosition);

    // calculate the diffuse lighting
    float diffuse = max(dot(normal, lightDirection), 0.0);

    // calculate the specular lighting
    float specular = 0.0;
    if (diffuse > 0.0) {
        vec3 reflectDirection = reflect(-lightDirection, normal);
        vec3 viewDirection = normalize(vViewPosition);
        float specularAngle = max(dot(reflectDirection, viewDirection), 0.0);
        specular = pow(specularAngle, 32.0);
    }

    // set the final color of the fragment
    gl_FragColor = vec4(uMaterialColor * uLightColor * (diffuse + specular), 1.0);
}`;