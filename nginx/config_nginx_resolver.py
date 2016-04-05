import os
import re
from jinja2 import Environment, FileSystemLoader

if __name__ == '__main__':

    resolvers = []
    with(open('/etc/resolv.conf')) as rc:
        ns_re = re.compile(r'^nameserver (.+)$')
        for line in rc:
          if ns_re.match(line):
                tokens = line.split(' ')
                resolvers.append(tokens[1].strip())

    templates_dir = os.path.dirname(__file__)
    jinja_env = Environment(loader=FileSystemLoader(templates_dir))
    template = jinja_env.get_template('resolver.conf.j2')
    result = template.render({'resolvers': resolvers})

    print(result)
