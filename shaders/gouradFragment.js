// define the Gouraud fragment shader
export const gouraudFragmentShader = `
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

    // set the final color of the fragment
    gl_FragColor = vec4(uMaterialColor * uLightColor * diffuse, 1.0);
}`;